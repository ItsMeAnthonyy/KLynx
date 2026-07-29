export const getConfirmConfig = (mode, selectedUser) => {
    switch (mode) {
        case "status": {
            const isActive = selectedUser.status === "active";

            return {
                title: isActive ? "Deactivate User" : "Activate User",
                message: `Are you sure you want to ${
                    isActive ? "deactivate" : "activate"
                } ${selectedUser.first_name} ${selectedUser.last_name}?`,
                note: isActive
                    ? "They will lose system access."
                    : "They will regain system access.",
                confirmText: isActive ? "Deactivate" : "Activate",
                variant: isActive ? "danger" : "success"
            }
        }
        
        
    }
}