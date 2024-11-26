import type {
  AnyObjectSchema,
  AnySchema,
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  StringSchema
} from 'yup';

export type ConditionalSchema<T> = T extends string
  ? StringSchema
  : T extends number
  ? NumberSchema
  : T extends boolean
  ? BooleanSchema
  : T extends Record<any, any>
  ? AnyObjectSchema
  : T extends any[]
  ? ArraySchema<any, any>
  : AnySchema;

export type Shape<Fields> = {
  [Key in keyof Fields]: ConditionalSchema<Fields[Key]>;
};
