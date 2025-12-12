import { ruRU, enUS } from '@clerk/localizations';

export const clerkLocalizationRu = {
  ...ruRU,
  signIn: {
    ...ruRU.signIn,
    start: {
      ...ruRU.signIn?.start,
      title: 'Добро пожаловать',
      subtitle: 'Войдите, чтобы продолжить',
    },
  },
  signUp: {
    ...ruRU.signUp,
    start: {
      ...ruRU.signUp?.start,
      title: 'Создать аккаунт',
      subtitle: 'Зарегистрируйтесь, чтобы начать',
    },
  },
};

export const clerkLocalizationEn = {
  ...enUS,
  signIn: {
    ...enUS.signIn,
    start: {
      ...enUS.signIn?.start,
      title: 'Welcome back',
      subtitle: 'Sign in to continue',
    },
  },
  signUp: {
    ...enUS.signUp,
    start: {
      ...enUS.signUp?.start,
      title: 'Create an account',
      subtitle: 'Sign up to get started',
    },
  },
};

export const clerkAppearance = {
  variables: {
    colorPrimary: 'oklch(0.852 0.199 91.936)',
    colorBackground: 'oklch(1 0 0)',
    colorText: 'oklch(0.141 0.005 285.823)',
    colorTextSecondary: 'oklch(0.552 0.016 285.938)',
    colorInputBackground: 'oklch(0.92 0.004 286.32)',
    colorInputText: 'oklch(0.141 0.005 285.823)',
    colorDanger: 'oklch(0.577 0.245 27.325)',
    borderRadius: '0.375rem',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full !shadow-none !border-none',
    card: '!bg-transparent !border-none !shadow-none w-full mx-auto !rounded-none',
    main: '!shadow-none !border-none',
    headerTitle: 'text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all rounded-md',
    socialButtonsBlockButtonText: 'text-secondary-foreground',
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground',
    formFieldLabel: 'text-foreground',
    formFieldInput:
      'bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md',
    formButtonPrimary: 'bg-primary !text-primary-foreground hover:bg-primary/90 transition-all rounded-md',
    footerActionLink: 'text-primary hover:underline underline-offset-4',
    footer: 'bg-transparent',
    footerAction: 'bg-transparent',
    identityPreviewText: 'text-foreground',
    identityPreviewEditButton: 'text-primary hover:underline underline-offset-4',
    formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground',
    otpCodeFieldInput: 'border-border text-foreground rounded-md',
    formResendCodeLink: 'text-primary hover:underline underline-offset-4',
    alert: 'bg-destructive/10 border-destructive text-destructive rounded-md',
    alertText: 'text-destructive',
    userButtonPopoverCard: 'bg-card border border-border rounded-md',
    userButtonPopoverActionButton: 'text-foreground hover:bg-accent hover:text-accent-foreground',
    userButtonPopoverActionButtonText: 'text-foreground',
    userButtonPopoverActionButtonIcon: 'text-muted-foreground',
    userButtonPopoverFooter: 'hidden',
    userPreviewMainIdentifier: 'text-foreground',
    userPreviewSecondaryIdentifier: 'text-muted-foreground',
  },
};
