import { useRef } from 'react'

const usePushNotification = () => {
    const notificationRef = useRef(null);

    if (Notification.permission !== 'granted'){
        try{
            Notification.requestPermission().then((permission) => {
                if(permission !== 'granted return')
                return;
            });
        } catch (error) {
            if(error instanceof TypeError){
                Notification.requestPermission((permission) => {
                    if(permission !== 'granted')
                    return
                });
            }else{
                console.error(error);
            }
        }
    }
    
    const setNotificationClickEvent = () => {
        notificationRef.current.onclick = (event) => {
            event.preventDefault();
            window.focus();
            notificationRef.current.close();
        };
    };


    const fireNotificationWithTimeout = ( title, option = {}) => {
        if(Notification.permission !== 'granted')
        return;

        const newOption = {
            ...option,
        };

        if(!notificationRef.current){
            notificationRef.current = new Notification(title, newOption);
            setNotificationClickEvent();
            notificationRef.current = null;
        }
    };
    return { fireNotificationWithTimeout };
}

export default usePushNotification