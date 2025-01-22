export class MissingEnvironmentVariable extends Error {
  constructor(variableName: string) {
    super(`Environment variable not passed: ${variableName}`);
  }
}

export class MissingBodyData extends Error {
  constructor() {
    super("No body found");
  }
}

export class MissingParameters extends Error {
  constructor(parameterName: string) {
    super(`parameter is empty : ${parameterName}`);
  }
}
