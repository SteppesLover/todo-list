import styled from 'styled-components';

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

function TextInputWithLabel({
  elementId,
  label,
  onChange,
  ref,
  value,
}) {
  return (
    <>
      <StyledLabel  htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel