import { Elysia, t } from 'elysia';
import { Schema, model } from 'mongoose';
import { cors } from '@elysiajs/cors'

//==================================================
// Database Setup
//==================================================

import '../database/db.setup';

//==================================================
// Database Schema
//==================================================

/*
Context's properties consists of

request: Raw Request for accessing data as web standard type
body: Body which come with the request
query: Parsed path query as a simple object
params: Path parameters as a simple object
store: A global mutable store for Elysia instance
set: Response representation
    status: response status
    headers: response headers
    redirect: redirect to new path
*/

const allocationRequestItemSchema = new Schema({
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    itemName: { type: String, required: true },
    description: String,
    links: [String],
    allocatedAmount: Number,
    subcode: String
});

const allocationRequestSchema = new Schema({
    period: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'reviewed', 'finalized'] 
    },
    requestItems: [allocationRequestItemSchema]
});

const clubSchema = new Schema({
    presidentEmail: { type: String, required: true },
    treasurerEmail: { type: String, required: true },
    clubName: { type: String, required: true },
    clubCode: { type: String, required: true },
    allocationRequests : {type: [allocationRequestSchema], default: []}
});
  
export const Club = model('Club', clubSchema);

//==================================================
// Database API
//==================================================

export const app = new Elysia();
//==================================================
// Middleware
//==================================================
app.use(cors())
    .get('/', () => {"Hello World!"})

//==================================================
// Club Profiles
//==================================================
interface ClubUpdate {
    presidentEmail?: string;
    treasurerEmail?: string;
    clubName?: string;
    clubCode?: string;
}

app
    .get('/clubs/:clubCode', async ({ params: { clubCode }, set }) => {
        const club = await Club.findById({ _id: clubCode});
        if (!club) {
            set.status = 404;
            return { message: "Club not found", status: 404  };
        }
        return club;
    })
    /*
    .delete('/clubs/:clubCode', async ({ params: { clubCode }, set }) => {
        const club = await Club.findOneAndDelete({ clubCode: clubCode });
        if (!club) {
            set.status = 404;
            return { message: "Club not found", status: 404  };
        }
        return { message: "Club deleted successfully" };
    })
    */
    .guard({
        body: t.Object({
            presidentEmail: t.String(),
            treasurerEmail: t.String(),
            clubName: t.String(),
            clubCode: t.String(),
        })
    }, app => app
        .post('/clubs', async ({ body }) => {
            const newClub = new Club();
            newClub.presidentEmail = body.presidentEmail;
            newClub.treasurerEmail = body.treasurerEmail;
            newClub.clubName = body.clubName;
            newClub.clubCode = body.clubCode;
            await newClub.save();
            return newClub;
        })
        
        .patch('/clubs/:clubCode', async ({ params: { clubCode }, body, set }) => {
            const update: ClubUpdate = {};
            if (body.presidentEmail) update.presidentEmail = body.presidentEmail;
            if (body.treasurerEmail) update.treasurerEmail = body.treasurerEmail;
            if (body.clubName) update.clubName = body.clubName;
            if (body.clubCode) update.clubCode = body.clubCode;
            const club = await Club.findOneAndUpdate({ clubCode: clubCode }, update, { new: true }).exec();
            if (!club) {
                set.status = 404;
                return { message: "Club not found", status: 404  };
            }
            return club;
        })
    )

//==================================================
// Club Allocation Requests
//==================================================
    .get('/allocation-requests/:clubCode', async ({ params: { clubCode }, set }) => {
        const club = await Club.findOne({ clubCode: clubCode });
        if (!club) {
            set.status = 404;
            return { message: "Request not found", status: 404  };
        }
        return club.allocationRequests
    })
    /*
    .delete('/allocation-requests/:clubCode', async ({ params: { clubCode }, set, body }) => {
        // Implement logic to delete the request with the given period
        // TBH should never need this route
    }, {
        body: t.Object({
            period: t.String(),
        })
    })
    */
    .guard({
        body: t.Object({
            period: t.String(),
            status: t.String(),
            requestItems: t.Array(t.Object({
                price: t.Number(),
                quantity: t.Number(),
                itemName: t.String(),
                description: t.String(),
                links: t.Array(t.String()),
                allocatedAmount: t.Number(),
                subcode: t.String()
            }))
        })
    }, app => app
        .post('/allocation-requests/:clubCode', async ({ params: { clubCode }, body, set }) => {
            // Logic to add a new request with the given period to the list of requests
            // Should throw an error if a request with the given period already exists
            const club = await Club.findOne({ clubCode: clubCode });
            if (!club) {
                set.status = 404;
                return { message: "Club not found", status: 404  };
            }
            const request = club.allocationRequests.find((request) => request.period === body.period);
            if (request) {
                set.status = 400;
                return { message: "Request already exists", status: 400  };
            }
            club.allocationRequests.push(body);
            await club.save();
            return club;
        })
        .patch('/allocation-requests/:clubCode', async ({ params: { clubCode }, body, set }) => {
            // Logic to update the request with the given period
            // Should throw an error if a request with the given period does not exist
            const club = await Club.findOneAndUpdate(
                { clubCode: clubCode, "allocationRequests.period": body.period },
                { $set: { "allocationRequests.$": body } },
                { new: true }
            ).exec();
            if (!club) {
                set.status = 404;
                return { message: "Request not found", status: 404  };
            }
            return club;
        })
        .delete('/allocation-requests/:clubCode/:requestPeriod', async ({ params: { clubCode, requestPeriod }, set }) => {
            // Logic to delete the request with the given period
            // Should throw an error if a request with the given period does not exist
        })
    )
    .listen(3000);

console.log("Server started on port 3000");

