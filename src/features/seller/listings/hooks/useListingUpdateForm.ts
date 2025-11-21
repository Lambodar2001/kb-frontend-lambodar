import { useCallback, useState } from 'react';

export type ListingFormErrors<TForm> = Partial<Record<keyof TForm, string>>;
export type ListingFormTouched<TForm> = Partial<Record<keyof TForm, boolean>>;

export type ListingFormValidators<TForm> = {
  [K in keyof TForm]?: (value: TForm[K], values: TForm) => string | undefined;
};

export type ListingFormNormalizers<TForm> = {
  [K in keyof TForm]?: (value: TForm[K]) => any;
};

type UseListingUpdateFormOptions<TForm> = {
  initialValues: TForm;
  validators?: ListingFormValidators<TForm>;
  normalizers?: ListingFormNormalizers<TForm>;
};

type UseListingUpdateFormReturn<TForm> = {
  values: TForm;
  errors: ListingFormErrors<TForm>;
  touched: ListingFormTouched<TForm>;
  handleChange: <K extends keyof TForm>(field: K, value: TForm[K]) => void;
  handleBlur: <K extends keyof TForm>(field: K, value?: TForm[K]) => void;
  validateForm: () => boolean;
  initializeForm: (nextValues: TForm) => void;
  getChangedFields: () => (keyof TForm)[];
};

const identity = (value: any) => value;

function useListingUpdateForm<TForm extends Record<string, any>>({
  initialValues,
  validators = {},
  normalizers = {},
}: UseListingUpdateFormOptions<TForm>): UseListingUpdateFormReturn<TForm> {
  const [values, setValues] = useState<TForm>(initialValues);
  const [initialState, setInitialState] = useState<TForm>(initialValues);
  const [errors, setErrors] = useState<ListingFormErrors<TForm>>({});
  const [touched, setTouched] = useState<ListingFormTouched<TForm>>({});

  const validateField = useCallback(
    <K extends keyof TForm>(field: K, value: TForm[K], currentValues: TForm = values) => {
      const validator = validators[field];
      return validator ? validator(value, currentValues) : undefined;
    },
    [validators, values],
  );

  const handleChange = useCallback(
    <K extends keyof TForm>(field: K, value: TForm[K]) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          const fieldError = validateField(field, value, next);
          setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldError }));
        }
        return next;
      });
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    <K extends keyof TForm>(field: K, value?: TForm[K]) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const valueToValidate = value !== undefined ? value : values[field];
      const currentValues = value !== undefined ? { ...values, [field]: value } : values;
      const fieldError = validateField(field, valueToValidate, currentValues);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldError }));
    },
    [validateField, values],
  );

  const validateForm = useCallback(() => {
    let isValid = true;
    const nextErrors: ListingFormErrors<TForm> = {};
    const fields = Object.keys(values) as Array<keyof TForm>;

    fields.forEach((field) => {
      const fieldError = validateField(field, values[field], values);
      if (fieldError) {
        nextErrors[field] = fieldError;
        isValid = false;
      }
    });

    setErrors(nextErrors);
    setTouched((prev) => {
      const updated = { ...prev };
      fields.forEach((field) => {
        updated[field] = true;
      });
      return updated;
    });

    return isValid;
  }, [validateField, values]);

  const initializeForm = useCallback((nextValues: TForm) => {
    setValues(nextValues);
    setInitialState(nextValues);
    setErrors({});
    setTouched({});
  }, []);

  const getChangedFields = useCallback(() => {
    const fields = Object.keys(values) as Array<keyof TForm>;
    return fields.filter((field) => {
      const normalize = normalizers[field] ?? identity;
      return normalize(values[field]) !== normalize(initialState[field]);
    });
  }, [initialState, normalizers, values]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    initializeForm,
    getChangedFields,
  };
}

export default useListingUpdateForm;
