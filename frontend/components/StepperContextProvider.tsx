import React, { createContext, useContext, useState} from "react";

export interface StepperContextType {
    chosenId: number
    setChosenId: (ids: number) => void
    stepNums: number
}
const StepperContext = createContext<StepperContextType | undefined>(undefined)


 export const StepperContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [chosenId, setChosenId] = useState<number>(0)
    const stepNums = React.isValidElement(children)? React.Children.count(children.props.children) : 0
    return (
        <StepperContext.Provider value={{chosenId, setChosenId, stepNums}}>
            {children}
        </StepperContext.Provider>
    )
}

export const useStepContext = () => {
    const ctx = useContext(StepperContext)
    if (!ctx) throw new Error("useTreeContext must be used inside TreeProvider");
    return ctx;
}
