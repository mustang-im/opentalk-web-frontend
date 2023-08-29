import SearchTextField from "../../SearchTextField";
import ParticipantGroupByForm from "./ParticipantGroupByForm";
import ParticipantGroups from "./ParticipantGroups";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectShowParticipantGroups, setParticipantsSearchValue } from "../../../store/slices/uiSlice";
import ParticipantNoGroups from "./ParticipantNoGroups";
import { memo, useCallback } from "react";

const ParticipantsContainer = () => {
   const dispatch = useAppDispatch();
   const groupParticipantsEnabled = useAppSelector(selectShowParticipantGroups);

   const dispatchNextSearchValue = useCallback((nextSearchValue: string) => {
      dispatch(setParticipantsSearchValue(nextSearchValue));
   }, []);

   return (
      <>
         <SearchTextField onSearch={dispatchNextSearchValue} fullWidth showSort />
         <ParticipantGroupByForm />
         {groupParticipantsEnabled ? <ParticipantGroups flex={1} /> : <ParticipantNoGroups />}
      </>
   );
}

export default memo(ParticipantsContainer);