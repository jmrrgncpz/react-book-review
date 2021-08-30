import React from "react";

const FeedContext = React.createContext({
    isPublishedFilterActive: false,
    isDraftFilterActive: false,
    searchInput: ""
});
export const FeedProvider = FeedContext.Provider;

export default FeedContext;