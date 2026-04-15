export type PluralForms = [one: string, few: string, many: string];

export function createPlural(locale = 'ru') {
  const pluralRules = new Intl.PluralRules(locale);

  return (count: number, forms: PluralForms): string => {
    const rule = pluralRules.select(count);

    if (rule === 'one') {
      return forms[0];
    }

    if (rule === 'few') {
      return forms[1];
    }

    return forms[2];
  };
}

const pluralByLocale = new Map<string, ReturnType<typeof createPlural>>();

export function pluralize(count: number, forms: PluralForms, locale = 'ru'): string {
  let plural = pluralByLocale.get(locale);

  if (!plural) {
    plural = createPlural(locale);
    pluralByLocale.set(locale, plural);
  }

  return plural(count, forms);
}

export function pluralWithCount(count: number, forms: PluralForms, locale = 'ru'): string {
  return `${count} ${pluralize(count, forms, locale)}`;
}
