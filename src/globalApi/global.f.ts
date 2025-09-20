export function asFileDefinition(object: unknown) : IFileDefinition | undefined {
  const reference: IFileDefinition = {
    file: '',
    name: '',
    type: 'common'
  };

  if (hasShape<IFileDefinition>(object, reference)){
    return object as IFileDefinition
  }

  return undefined;
}

function hasShape<T extends object>(obj: unknown, shape: T): obj is T {
  if (typeof obj !== 'object' || obj === null) return false;

  const shapeKeys = Object.keys(shape);
  return shapeKeys.every((key) => key in obj);
}
