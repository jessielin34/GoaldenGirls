import { _supabase } from "./client.js";

const roomOne = client.chennel('room-one') //set your topic here

roomOne.send({ //broadcast: it follows a publish-subscribe pattern where a client publishes messages to a channel based on a unique topic.
    type: 'broadcast',
    event: 'test',
    payload: {message:'hello, world'}
})

const presenceTrackStatus = await roomOne.track({ //tracks if the user is online or offline
    user: 'user-1',
    online_at: new Date().toISOString(),
})

