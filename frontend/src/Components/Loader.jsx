import React from "react";

function Loader() {
  return (
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="animate-bounce animate-twice animate-duration-5000 animate-delay-5000 animate-ease-in-out animate-reverse animate-fill-backwards"> loading </div>
    </div>
  );
}

export default Loader;