// src/screens/BikeScreens/AddBikeDetailsScreen.tsx

import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SellFlowLayout from '../common/SellFlowLayout';
import {
  PrimaryButton,
  BottomSheetPicker,
  BottomSheetPickerOption,
  TextField,
  Textarea,
  DropdownField,
  DropdownOption,
  ReadonlyPickerInput
} from '@shared/components';
import { colors, spacing } from '@theme/tokens';
import { useFormState } from '@shared/form/hooks/useFormState';
import {
  CURRENT_YEAR,
  MIN_BIKE_YEAR,
  BikeDetailsFormValues,
  getDefaultBikeDetailsValues,
  bikeDetailsSchema,
} from '@shared/form/schemas/bikeDetailsSchema';
import { FormFieldConfig } from '@shared/form/config/types';
import { getBikeDetailsFieldConfig } from '@shared/form/config/bikeDetailsFields';
import { normalizeCreateResponse, getFriendlyApiError } from '@shared/utils';
import { toBikeCreateDTO } from '@shared/mappers/listingMappers';
import { addBike } from '@features/seller/sell/api/BikesApi';
import { useAuth } from '@context/AuthContext';
import { SellBikeStackParamList } from '../../navigation/SellBikeStack';

type AddBikeDetailsScreenNavigationProp = NativeStackNavigationProp<
  SellBikeStackParamList,
  'AddBikeDetails'
>;

const AddBikeDetailsScreen: React.FC = () => {
  const navigation = useNavigation<AddBikeDetailsScreenNavigationProp>();
  const { sellerId } = useAuth();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    touchField,
    validateForm,
  } = useFormState<BikeDetailsFormValues>({
    initialValues: getDefaultBikeDetailsValues(),
    schema: bikeDetailsSchema,
  });

  const [loading, setLoading] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  const yearOptions = useMemo<BottomSheetPickerOption<string>[]>(() => {
    const years: BottomSheetPickerOption<string>[] = [];
    for (let year = CURRENT_YEAR; year >= MIN_BIKE_YEAR; year -= 1) {
      const value = year.toString();
      years.push({ label: value, value });
    }
    return years;
  }, []);

  const fieldConfig = useMemo(
    () =>
      getBikeDetailsFieldConfig({
        onOpenYearPicker: () => setYearPickerVisible(true),
      }),
    [],
  );

  const renderField = (config: FormFieldConfig<BikeDetailsFormValues>) => {
    const field = config.field;
    const value = values[field];
    const error = touched[field] ? errors[field] : undefined;
    const labelAccessory = config.getLabelAccessory?.({ values });

    switch (config.component) {
      case 'text': {
        const formattedValue = value == null ? '' : String(value);
        return (
          <TextField
            key={String(field)}
            label={config.label}
            value={formattedValue}
            onChangeText={(text) => {
              const nextValue =
                config.transform?.(text, { values }) ?? text;
              setFieldValue(field, nextValue as BikeDetailsFormValues[typeof field], {
                validate: Boolean(touched[field]),
              });
            }}
            onBlur={() => handleBlur(field)}
            required={config.required}
            error={error}
            labelAccessory={labelAccessory}
            {...config.props}
          />
        );
      }
      case 'textarea': {
        const formattedValue = value == null ? '' : String(value);
        return (
          <Textarea
            key={String(field)}
            label={config.label}
            value={formattedValue}
            onChangeText={(text) => {
              const nextValue =
                config.transform?.(text, { values }) ?? text;
              setFieldValue(field, nextValue as BikeDetailsFormValues[typeof field], {
                validate: Boolean(touched[field]),
              });
            }}
            onBlur={() => handleBlur(field)}
            required={config.required}
            error={error}
            labelAccessory={labelAccessory}
            {...config.props}
          />
        );
      }
      case 'dropdown': {
        const props = config.props ?? {};
        const data: DropdownOption<any>[] = props.data ?? [];
        const { placeholder, ...restProps } = props;
        return (
          <DropdownField
            key={String(field)}
            label={config.label}
            data={data}
            value={value as any}
            onChange={(item) => {
              touchField(field);
              setFieldValue(field, item.value, { validate: true });
            }}
            required={config.required}
            error={error}
            placeholder={placeholder}
            {...restProps}
          />
        );
      }
      case 'readonlyPicker': {
        const props = config.props ?? {};
        const { onPress, ...restProps } = props;
        return (
          <ReadonlyPickerInput
            key={String(field)}
            label={config.label}
            value={value as string | number | null | undefined}
            required={config.required}
            error={error}
            onPress={onPress ?? (() => {})}
            {...restProps}
          />
        );
      }
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (sellerId == null) {
      Alert.alert('Error', 'Seller account not found');
      return;
    }

    const valid = validateForm();
    if (!valid) {
      return;
    }

    try {
      setLoading(true);
      const payload = toBikeCreateDTO(values, Number(sellerId));
      const response = await addBike(payload);
      const normalized = normalizeCreateResponse(response, 'bike');

      if (!normalized.success || normalized.id === null) {
        Alert.alert('Failed', normalized.rawMessage || 'Something went wrong');
        return;
      }

      navigation.navigate('SelectPhoto', { bikeId: normalized.id });
      Alert.alert('Success', normalized.message);
    } catch (error: any) {
      Alert.alert('Error', getFriendlyApiError(error, 'Failed to add bike'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SellFlowLayout
        title="Bike Details"
        onBack={() => navigation.goBack()}
        footer={
          <PrimaryButton
            label="Next"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            icon={<Icon name="arrow-right" size={20} color={colors.white} />}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
      >
        {fieldConfig.map((config) => renderField(config))}
        <View style={{ height: spacing.xxxl }} />
      </SellFlowLayout>

      <BottomSheetPicker
        visible={yearPickerVisible}
        title="Select Year"
        options={yearOptions}
        selectedValue={values.manufactureYear}
        onSelect={(year) => {
          touchField('manufactureYear');
          setFieldValue('manufactureYear', year, { validate: true });
        }}
        onClose={() => setYearPickerVisible(false)}
      />
    </>
  );
};

export default AddBikeDetailsScreen;
