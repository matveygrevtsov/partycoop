import React from 'react'

type Props = {
  onClick?: () => void
  correctInput: boolean
  text: string
  className: string
}

const SubmitButton: React.FC<Props> = ({
  onClick,
  correctInput,
  text,
  className,
}) => {
  if (!correctInput) {
    return (
      <button style={{ opacity: 0.6 }} className={className}>
        {text}
      </button>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {text}
    </button>
  )
}

export default SubmitButton
