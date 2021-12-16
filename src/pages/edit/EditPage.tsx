import React from "react";

import Editor from "rich-markdown-editor";

export const EditPage: React.FC = () => {
  
  return(
    <>
      <div>
        <Editor
          defaultValue="Hello world!"
        />
      </div>
    </>
  )
}