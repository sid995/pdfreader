import React from 'react'

type Props = {
  pdf_url: string
}

const PdfViewer = ({ pdf_url }: Props) => {
  return (
    <iframe
      width={"100%"}
      height={"100%"}
      src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
      className="w-full h-full"
    />
  )
}

export default PdfViewer