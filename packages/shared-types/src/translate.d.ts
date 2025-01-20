export type TranslateRequest = {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
};

export type TranslateResponse = {
  message: string;
  translatedText: string;
};

export type TranslateDbObject = TranslateRequest &
  TranslateResponse & {
    requestId: string;
  };
