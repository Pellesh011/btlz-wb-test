export const getHourTimestamp = (): number => {
    const now = new Date();
    const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    return startOfHour.getTime()/1000;
}