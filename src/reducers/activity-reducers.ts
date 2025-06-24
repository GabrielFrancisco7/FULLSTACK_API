// src/reducers/activity-reducers.ts
import { Activity } from "../types";

export type ActivityActions =
  | { type: "save-activity"; payload: { newActivity: Activity } }
  | { type: "set-activity"; payload: { id: Activity["id"] } };

export type ActivityState = {
  activities: Activity[];
  activeId: Activity["id"];
};

export const initialState: ActivityState = {
  activities: [],
  activeId: "",
};

export const activityReducer = (state: ActivityState = initialState, action: ActivityActions) => {
    switch (action.type) {
      case "save-activity": {
        let updateActivities: Activity[] = [];
        
        if (state.activeId) {
          updateActivities = state.activities.map(activity => 
            activity.id === state.activeId ? action.payload.newActivity : activity
          );
        } else {
          updateActivities = [...state.activities, action.payload.newActivity];
        }
    
        return {
          ...state,
          activities: updateActivities,
          activeId: ''
        };
      }
      
      case "set-activity": {
        return {
          ...state,
          activeId: action.payload.id,
        };
      }
      
      default:
        return state;
    }
  };