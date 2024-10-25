export class DateTime{

    public static calendarDate = (val: any)=>{
        const date = new Date(val);
        return `${date.getFullYear()}-${this.add0ToNumber(date.getMonth()+1)}-${this.add0ToNumber(date.getDate())}`;
    };
    private static add0ToNumber = (number: number)=>{
        return (number<10) ? `0${number}` : number
    }
}