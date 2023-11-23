import React from "react";

type IframeRendererProps = {
	srcDoc: string;
};

const IframeRenderer: React.FC<IframeRendererProps> = ({ srcDoc }) => {
	const srcDocWithStyles = `
  <style>
    body {
      overflow: auto;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    body {
      scrollbar-width: none; /* Firefox */
      scrollbar-color: transparent; /* Firefox */
    }
  </style>
  ${srcDoc}
`;

	return <iframe className="h-full w-full" srcDoc={srcDocWithStyles} />;
};

export default IframeRenderer;
