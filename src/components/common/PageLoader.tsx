import React from "react";

export const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground animate-pulse font-medium">লোড হচ্ছে...</p>
      </div>
    </div>
  );
};

export default PageLoader;
