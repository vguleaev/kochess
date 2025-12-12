import { ruRU } from '@clerk/localizations';

export const clerkLocalization = {
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

export const clerkAppearance = {
  variables: {
    colorPrimary: 'oklch(0.795 0.184 86.047)',
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorTextSecondary: '#666666',
    colorInputBackground: '#f5f5f5',
    colorInputText: '#1a1a1a',
    colorDanger: 'oklch(0.704 0.191 22.216)',
    borderRadius: '0.65rem',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full !shadow-none !border-none',
    card: '!bg-transparent !border-none !shadow-none w-full mx-auto !rounded-none',
    main: '!shadow-none !border-none',
    headerTitle: 'text-foreground',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButton: 'bg-secondary border-border text-secondary-foreground hover:bg-accent transition-colors',
    socialButtonsBlockButtonText: 'text-secondary-foreground',
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground',
    formFieldLabel: 'text-foreground',
    formFieldInput: 'bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring',
    formButtonPrimary: 'bg-primary text-primary-foreground hover:opacity-90 transition-opacity',
    footerActionLink: 'text-primary hover:text-primary/80',
    footer: 'bg-transparent',
    footerAction: 'bg-transparent',
    identityPreviewText: 'text-foreground',
    identityPreviewEditButton: 'text-primary',
    formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground',
    otpCodeFieldInput: 'border-border text-foreground',
    formResendCodeLink: 'text-primary',
    alert: 'bg-destructive/10 border-destructive text-destructive',
    alertText: 'text-destructive',
    userButtonPopoverCard: 'bg-card border border-border',
    userButtonPopoverActionButton: 'text-foreground hover:bg-accent',
    userButtonPopoverActionButtonText: 'text-foreground',
    userButtonPopoverActionButtonIcon: 'text-muted-foreground',
    userButtonPopoverFooter: 'hidden',
    userPreviewMainIdentifier: 'text-foreground',
    userPreviewSecondaryIdentifier: 'text-muted-foreground',
  },
};
