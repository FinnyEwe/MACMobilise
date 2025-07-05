import {StepperContextProvider} from "./StepperContextProvider";
import Step from "./Step";
import StepperContainer from "./StepperContainer";

const Stepper = ({id}: {id:number}) => {

    return (
        <StepperContextProvider>
            <StepperContainer id={id}>
                <Step title={"Drivers"} description={"Enter Driver Details"} id={1}/>
                <Step title={"Passengers"} description={"Enter Passenger Details"} id={2}/>
                <Step title={"Destination"} description={"Tell us where you're headed"} id={3}/>
                <Step title={"Tada!"} description={"Final Result"} id={4}/>
            </StepperContainer>
        </StepperContextProvider>
)
}
export default Stepper