import { snsFaClass } from '../utils.js';

export async function getEvents(){
    try{
        console.log(this);
        const events = this.findMany();
        return events;
    }catch(error){
        console.error("Error finding events:",error);
        throw new Error('Failed to find events');
    }
}

export async function createEvent(eventInfo,key){
    let snsPlatforms;
    let snsUrls;
    if(Array.isArray(eventInfo['sns-name[]'])){
        snsPlatforms = eventInfo['sns-name[]'];
        snsUrls = eventInfo['sns-url[]'];
    }else{
        snsPlatforms = [eventInfo['sns-name[]']];
        snsUrls = [eventInfo['sns-url[]']];
    };
    let eventSns = [];
    snsPlatforms.forEach((platform,index) => {
        eventSns.push({
            name: platform,
            url: snsUrls[index],
            faClass: snsFaClass[platform]
        })
    })
    let venueNames;
    let venueUrls;
    if(Array.isArray(eventInfo['venue-name[]'])){
        venueNames = eventInfo['venue-name[]'];
        venueUrls = eventInfo['venue-url[]'];
    }else{
        venueNames = [eventInfo['venue-name[]']];
        venueUrls = [eventInfo['venue-url[]']];
    };
    let venues = [];
    venueNames.forEach((name,index) => {
        venues.push({
            name: name,
            url: venueUrls[index],
        })
    })
    
    try{
        const event = await this.create({
            data: {
                name: eventInfo["name"],
                date: new Date(eventInfo["date"]),
                country: eventInfo["country"],
                venues: {
                    create: venues.map(venue => ({
                        name: eventInfo["venue-name"],
                        url: eventInfo["venue-url"]
                    }))
                },
                sns: {
                    create: eventSns.map(sns => ({
                        name: sns.name,
                        url: sns.url,
                        faClass: sns.faClass
                    })),
                },
                flyer: {
                    create: {
                        alt: eventInfo["name"],
                        src: key
                    }
                }
            }
        });
        return event;
    }catch(error){
        console.error("Error creating event:", error);
        throw new Error('Failed to create event');
    }
}

