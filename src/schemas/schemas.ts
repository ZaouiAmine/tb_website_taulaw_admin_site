import z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const addPlatformFeeSchema = z.object({
  platformFee: z
    .string()
    .min(1, "Platform Fees is required")
    .min(2, "Platform Fees must be at least 2 characters")
    .max(50, "Platform Fees must not exceed 50 characters"),
  value: z
    .string()
    .min(1, "value is required")
    .min(2, "value must be at least 2 characters")
    .max(50, "value must not exceed 50 characters"),
  valueType: z.string({ message: "Please select Percentage or Fixed" }),
});

export const dropdownManagementFormSchema = z.object({
  valuekeyName: z
    .string()
    .min(1, "value key Name is required")
    .min(2, "value key Name must be at least 2 characters")
    .max(50, "value key Name must not exceed 50 characters"),
  english: z
    .string()
    .min(1, "english is required")
    .min(2, "english must be at least 2 characters")
    .max(50, "english must not exceed 50 characters"),
  arabic: z
    .string()
    .min(1, "arabic is required")
    .min(2, "arabic must be at least 2 characters")
    .max(50, "arabic must not exceed 50 characters"),
  french: z
    .string()
    .min(1, "french is required")
    .min(2, "french must be at least 2 characters")
    .max(50, "french must not exceed 50 characters"),
});

export const specializationFormSchema = z.object({
  english: z
    .string()
    .min(1, "english is required")
    .min(2, "english must be at least 2 characters")
    .max(50, "english must not exceed 50 characters"),
  arabic: z
    .string()
    .min(1, "arabic is required")
    .min(2, "arabic must be at least 2 characters")
    .max(50, "arabic must not exceed 50 characters"),
  french: z
    .string()
    .min(1, "french is required")
    .min(2, "french must be at least 2 characters")
    .max(50, "french must not exceed 50 characters"),
});

export const getSpecializationFormSchema = (currentLanguage: string) => {
  const errorMessages = {
    en: {
      englishRequired: "English name is required",
      arabicRequired: "Arabic name is required",
      frenchRequired: "French name is required",
      englishMinLength: "English name must be at least 2 characters",
      arabicMinLength: "Arabic name must be at least 2 characters",
      frenchMinLength: "French name must be at least 2 characters",
      englishMaxLength: "English name must not exceed 50 characters",
      arabicMaxLength: "Arabic name must not exceed 50 characters",
      frenchMaxLength: "French name must not exceed 50 characters",
    },
    ar: {
      englishRequired: "الاسم الانجليزي مطلوب",
      arabicRequired: "الاسم العربي مطلوب",
      frenchRequired: "الاسم الفرنسي مطلوب",
      englishMinLength: "الاسم الانجليزي يجب أن يكون على الأقل حرفين",
      arabicMinLength: "الاسم العربي يجب أن يكون على الأقل حرفين",
      frenchMinLength: "الاسم الفرنسي يجب أن يكون على الأقل حرفين",
      englishMaxLength: "الاسم الانجليزي يجب ألا يتجاوز 50 حرف",
      arabicMaxLength: "الاسم العربي يجب ألا يتجاوز 50 حرف",
      frenchMaxLength: "الاسم الفرنسي يجب ألا يتجاوز 50 حرف",
    },
    fr: {
      englishRequired: "Le nom anglais est requis",
      arabicRequired: "Le nom arabe est requis",
      frenchRequired: "Le nom français est requis",
      englishMinLength: "Le nom anglais doit contenir au moins 2 caractères",
      arabicMinLength: "Le nom arabe doit contenir au moins 2 caractères",
      frenchMinLength: "Le nom français doit contenir au moins 2 caractères",
      englishMaxLength: "Le nom anglais ne doit pas dépasser 50 caractères",
      arabicMaxLength: "Le nom arabe ne doit pas dépasser 50 caractères",
      frenchMaxLength: "Le nom français ne doit pas dépasser 50 caractères",
    },
  };

  const messages =
    errorMessages[currentLanguage as keyof typeof errorMessages] ||
    errorMessages.en;

  return z.object({
    english: z
      .string()
      .min(1, messages.englishRequired)
      .min(2, messages.englishMinLength)
      .max(50, messages.englishMaxLength),
    arabic: z
      .string()
      .min(1, messages.arabicRequired)
      .min(2, messages.arabicMinLength)
      .max(50, messages.arabicMaxLength),
    french: z
      .string()
      .min(1, messages.frenchRequired)
      .min(2, messages.frenchMinLength)
      .max(50, messages.frenchMaxLength),
  });
};

export const lawyerPackageFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  numberOfCases: z.coerce.number().min(0, "Number of cases must be 0 or more"),
  numberOfAssistants: z.coerce.number().min(0, "Number of assistants must be 0 or more"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  durationInDays: z.coerce.number().min(1, "Duration must be at least 1 day"),
  isActive: z.boolean().default(true),
});


export const getCasePhaseFormSchema = (currentLanguage: string) => {
  const errorMessages = {
    en: {
      arabicRequired: "Arabic name is required",
      englishRequired: "English name is required",
      frenchRequired: "French name is required",
      arabicMinLength: "Arabic name must be at least 2 characters",
      englishMinLength: "English name must be at least 2 characters",
      frenchMinLength: "French name must be at least 2 characters",
      arabicMaxLength: "Arabic name must not exceed 50 characters",
      englishMaxLength: "English name must not exceed 50 characters",
      frenchMaxLength: "French name must not exceed 50 characters",
    },
    ar: {
      arabicRequired: "الاسم العربي مطلوب",
      englishRequired: "الاسم الانجليزي مطلوب",
      frenchRequired: "الاسم الفرنسي مطلوب",
      arabicMinLength: "الاسم العربي يجب أن يكون على الأقل حرفين",
      englishMinLength: "الاسم الانجليزي يجب أن يكون على الأقل حرفين",
      frenchMinLength: "الاسم الفرنسي يجب أن يكون على الأقل حرفين",
      arabicMaxLength: "الاسم العربي يجب ألا يتجاوز 50 حرف",
      englishMaxLength: "الاسم الانجليزي يجب ألا يتجاوز 50 حرف",
      frenchMaxLength: "الاسم الفرنسي يجب ألا يتجاوز 50 حرف",
    },
    fr: {
      arabicRequired: "Le nom arabe est requis",
      englishRequired: "Le nom anglais est requis",
      frenchRequired: "Le nom français est requis",
      arabicMinLength: "Le nom arabe doit contenir au moins 2 caractères",
      englishMinLength: "Le nom anglais doit contenir au moins 2 caractères",
      frenchMinLength: "Le nom français doit contenir au moins 2 caractères",
      arabicMaxLength: "Le nom arabe ne doit pas dépasser 50 caractères",
      englishMaxLength: "Le nom anglais ne doit pas dépasser 50 caractères",
      frenchMaxLength: "Le nom français ne doit pas dépasser 50 caractères",
    },
  };

  const messages =
    errorMessages[currentLanguage as keyof typeof errorMessages] ||
    errorMessages.en;

  return z.object({
    nameAr: z
      .string()
      .min(1, messages.arabicRequired)
      .min(2, messages.arabicMinLength)
      .max(50, messages.arabicMaxLength),
    nameEn: z
      .string()
      .min(1, messages.englishRequired)
      .min(2, messages.englishMinLength)
      .max(50, messages.englishMaxLength),
    nameFr: z
      .string()
      .min(1, messages.frenchRequired)
      .min(2, messages.frenchMinLength)
      .max(50, messages.frenchMaxLength),
  });
};

export const getCaseCategoryFormSchema = (currentLanguage: string) => {
  const errorMessages = {
    en: {
      arabicRequired: "Arabic name is required",
      englishRequired: "English name is required",
      frenchRequired: "French name is required",
      arabicMinLength: "Arabic name must be at least 2 characters",
      englishMinLength: "English name must be at least 2 characters",
      frenchMinLength: "French name must be at least 2 characters",
      arabicMaxLength: "Arabic name must not exceed 50 characters",
      englishMaxLength: "English name must not exceed 50 characters",
      frenchMaxLength: "French name must not exceed 50 characters",
    },
    ar: {
      arabicRequired: "الاسم العربي مطلوب",
      englishRequired: "الاسم الانجليزي مطلوب",
      frenchRequired: "الاسم الفرنسي مطلوب",
      arabicMinLength: "الاسم العربي يجب أن يكون على الأقل حرفين",
      englishMinLength: "الاسم الانجليزي يجب أن يكون على الأقل حرفين",
      frenchMinLength: "الاسم الفرنسي يجب أن يكون على الأقل حرفين",
      arabicMaxLength: "الاسم العربي يجب ألا يتجاوز 50 حرف",
      englishMaxLength: "الاسم الانجليزي يجب ألا يتجاوز 50 حرف",
      frenchMaxLength: "الاسم الفرنسي يجب ألا يتجاوز 50 حرف",
    },
    fr: {
      arabicRequired: "Le nom arabe est requis",
      englishRequired: "Le nom anglais est requis",
      frenchRequired: "Le nom français est requis",
      arabicMinLength: "Le nom arabe doit contenir au moins 2 caractères",
      englishMinLength: "Le nom anglais doit contenir au moins 2 caractères",
      frenchMinLength: "Le nom français doit contenir au moins 2 caractères",
      arabicMaxLength: "Le nom arabe ne doit pas dépasser 50 caractères",
      englishMaxLength: "Le nom anglais ne doit pas dépasser 50 caractères",
      frenchMaxLength: "Le nom français ne doit pas dépasser 50 caractères",
    },
  };

  const messages =
    errorMessages[currentLanguage as keyof typeof errorMessages] ||
    errorMessages.en;

  return z.object({
    nameAr: z
      .string()
      .min(1, messages.arabicRequired)
      .min(2, messages.arabicMinLength)
      .max(50, messages.arabicMaxLength),
    nameEn: z
      .string()
      .min(1, messages.englishRequired)
      .min(2, messages.englishMinLength)
      .max(50, messages.englishMaxLength),
    nameFr: z
      .string()
      .min(1, messages.frenchRequired)
      .min(2, messages.frenchMinLength)
      .max(50, messages.frenchMaxLength),
  });
};

export const getCaseChamberFormSchema = (currentLanguage: string) => {
  const errorMessages = {
    en: {
      arabicRequired: "Arabic name is required",
      englishRequired: "English name is required",
      frenchRequired: "French name is required",
      arabicMinLength: "Arabic name must be at least 2 characters",
      englishMinLength: "English name must be at least 2 characters",
      frenchMinLength: "French name must be at least 2 characters",
      arabicMaxLength: "Arabic name must not exceed 50 characters",
      englishMaxLength: "English name must not exceed 50 characters",
      frenchMaxLength: "French name must not exceed 50 characters",
    },
    ar: {
      arabicRequired: "الاسم العربي مطلوب",
      englishRequired: "الاسم الانجليزي مطلوب",
      frenchRequired: "الاسم الفرنسي مطلوب",
      arabicMinLength: "الاسم العربي يجب أن يكون على الأقل حرفين",
      englishMinLength: "الاسم الانجليزي يجب أن يكون على الأقل حرفين",
      frenchMinLength: "الاسم الفرنسي يجب أن يكون على الأقل حرفين",
      arabicMaxLength: "الاسم العربي يجب ألا يتجاوز 50 حرف",
      englishMaxLength: "الاسم الانجليزي يجب ألا يتجاوز 50 حرف",
      frenchMaxLength: "الاسم الفرنسي يجب ألا يتجاوز 50 حرف",
    },
    fr: {
      arabicRequired: "Le nom arabe est requis",
      englishRequired: "Le nom anglais est requis",
      frenchRequired: "Le nom français est requis",
      arabicMinLength: "Le nom arabe doit contenir au moins 2 caractères",
      englishMinLength: "Le nom anglais doit contenir au moins 2 caractères",
      frenchMinLength: "Le nom français doit contenir au moins 2 caractères",
      arabicMaxLength: "Le nom arabe ne doit pas dépasser 50 caractères",
      englishMaxLength: "Le nom anglais ne doit pas dépasser 50 caractères",
      frenchMaxLength: "Le nom français ne doit pas dépasser 50 caractères",
    },
  };

  const messages =
    errorMessages[currentLanguage as keyof typeof errorMessages] ||
    errorMessages.en;

  return z.object({
    nameAr: z
      .string()
      .min(1, messages.arabicRequired)
      .min(2, messages.arabicMinLength)
      .max(50, messages.arabicMaxLength),
    nameEn: z
      .string()
      .min(1, messages.englishRequired)
      .min(2, messages.englishMinLength)
      .max(50, messages.englishMaxLength),
    nameFr: z
      .string()
      .min(1, messages.frenchRequired)
      .min(2, messages.frenchMinLength)
      .max(50, messages.frenchMaxLength),
  });
};

export const getStateFormSchema = (currentLanguage: string) => {
  const errorMessages = {
    en: {
      arabicRequired: "Arabic name is required",
      englishRequired: "English name is required",
      frenchRequired: "French name is required",
      arabicMinLength: "Arabic name must be at least 2 characters",
      englishMinLength: "English name must be at least 2 characters",
      frenchMinLength: "French name must be at least 2 characters",
      arabicMaxLength: "Arabic name must not exceed 50 characters",
      englishMaxLength: "English name must not exceed 50 characters",
      frenchMaxLength: "French name must not exceed 50 characters",
    },
    ar: {
      arabicRequired: "الاسم العربي مطلوب",
      englishRequired: "الاسم الانجليزي مطلوب",
      frenchRequired: "الاسم الفرنسي مطلوب",
      arabicMinLength: "الاسم العربي يجب أن يكون على الأقل حرفين",
      englishMinLength: "الاسم الانجليزي يجب أن يكون على الأقل حرفين",
      frenchMinLength: "الاسم الفرنسي يجب أن يكون على الأقل حرفين",
      arabicMaxLength: "الاسم العربي يجب ألا يتجاوز 50 حرف",
      englishMaxLength: "الاسم الانجليزي يجب ألا يتجاوز 50 حرف",
      frenchMaxLength: "الاسم الفرنسي يجب ألا يتجاوز 50 حرف",
    },
    fr: {
      arabicRequired: "Le nom arabe est requis",
      englishRequired: "Le nom anglais est requis",
      frenchRequired: "Le nom français est requis",
      arabicMinLength: "Le nom arabe doit contenir au moins 2 caractères",
      englishMinLength: "Le nom anglais doit contenir au moins 2 caractères",
      frenchMinLength: "Le nom français doit contenir au moins 2 caractères",
      arabicMaxLength: "Le nom arabe ne doit pas dépasser 50 caractères",
      englishMaxLength: "Le nom anglais ne doit pas dépasser 50 caractères",
      frenchMaxLength: "Le nom français ne doit pas dépasser 50 caractères",
    },
  };

  const messages =
    errorMessages[currentLanguage as keyof typeof errorMessages] ||
    errorMessages.en;

  return z.object({
    nameAr: z
      .string()
      .min(1, messages.arabicRequired)
      .min(2, messages.arabicMinLength)
      .max(50, messages.arabicMaxLength),
    nameEn: z
      .string()
      .min(1, messages.englishRequired)
      .min(2, messages.englishMinLength)
      .max(50, messages.englishMaxLength),
    nameFr: z
      .string()
      .min(1, messages.frenchRequired)
      .min(2, messages.frenchMinLength)
      .max(50, messages.frenchMaxLength),
  });
};