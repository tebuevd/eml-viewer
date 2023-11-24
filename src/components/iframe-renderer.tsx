type IframeRendererProps = {
	srcDoc: string;
};

function IframeRenderer({ srcDoc }: IframeRendererProps) {
	const srcDocWithStyles = `
  <style>
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    html, body {
      "-ms-overflow-style": none, /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      scrollbar-color: transparent; /* Firefox */
    }
  </style>
  ${srcDoc}
`;

	return <iframe className="h-full w-full" srcDoc={srcDocWithStyles} />;
}

export default IframeRenderer;
