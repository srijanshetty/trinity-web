import FormError from './FormError';

const Input = (props) => {
  const margins = props.label ? `mt-1 mb-6` : `mb-2`;
  const error =
    props.form.touched[props.field.name] && props.form.errors[props.field.name];

  const inputError = error ? 'border-red' : '';
  const errorMsg = props.label ? '-mt-6 mb-4' : '-mt-2 mb-2';

  return (
    <div className="relative flex-col">
      {props.label && (
        <label className="font-semibold">
          {props.label}
          {props.required && '*'}
        </label>
      )}
      <input
        className={`text-black bg-white focus:text-lg rounded p-3 w-full ${margins} ${inputError}`}
        {...props.field}
        {...props}
      />
      {error && (
        <div className={`text-left ${errorMsg}`}>
          <FormError name={props.field.name} />
        </div>
      )}
    </div>
  );
};

export default Input;
