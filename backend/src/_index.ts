import { Elysia, t } from 'elysia';
import { Schema, model } from 'mongoose';
import { logger } from '@bogeychan/elysia-logger';

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

const clubAllocationRequestSchema = new Schema({
    clubCode: { type: String, required: true },
    period: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'reviewed', 'finalized'] 
    },
    requestItems: [allocationRequestItemSchema]
});

type IclubAllocationRequest = {
    clubCode: string,
    period: string,
    status: 'pending' | 'reviewed' | 'finalized',
    requestItems: {
        price: number,
        quantity: number,
        itemName: string,
        description?: string,
        links?: string[],
        allocatedAmount?: number,
        subcode?: string
    }[]
} 

export const ClubRequest = model('ClubRequest', clubAllocationRequestSchema);

const clubSchema = new Schema({
    presidentEmail: { type: String, required: true },
    treasurerEmail: { type: String, required: true },
    clubName: { type: String, required: true },
    clubCode: { type: String, required: true },
    allocationRequests: { type: [clubAllocationRequestSchema], default: [] }
});
  
export const Club = model('Club', clubSchema);

//==================================================
// Database API
//==================================================

const clubs = new Elysia({ prefix: 'clubs' })
    // Schema validate create club profile
        .guard({
            body: t.Object({
                presidentEmail: t.String(),
                treasurerEmail: t.String(),
                clubName: t.String(),
                clubCode: t.String()
            })
        }, app => app
            .post('/', async ({ body }) => {
                const newClub = new Club();
                newClub.presidentEmail = body.presidentEmail;
                newClub.treasurerEmail = body.treasurerEmail;
                newClub.clubName = body.clubName;
                newClub.clubCode = body.clubCode;
                const result = await newClub.save();
                return newClub;
            })
            .patch('/:clubCode', async ({ params: { clubCode }, body }) => {
                const club = await Club.findOneAndUpdate({ clubCode: clubCode }, body, { new: true }).exec();
                if (!club) {
                    return { message: 'Club not found', status: 404 };
                }
                return club;
            })
    )
    .get('/:clubCode', async ({ params: { clubCode }, set}) => {
        const club = await Club.findOne({ clubCode: clubCode }).exec();
        if (!club) {
            set.status = 404;
            return { message: 'Club not found', status: 404 };
        }
        return club;
    })
    .delete('/:clubCode', async ({ params: { clubCode }}) => {
        const club = await Club.findOneAndDelete({ clubCode: clubCode }).exec();
        if (!club) {
            return { message: 'Club not found', status: 404 };
        }
        return club;
    })

const requests = new Elysia({ prefix: 'requests' })
    // Schema validate create request
    .guard({
        body: t.Object({
            period: t.String()
        })  
    }, app => app
        .post('/:clubCode', async ({ params: { clubCode }, body}) => {
            const newRequest = new ClubRequest();
            newRequest.clubCode = clubCode;
            newRequest.period = body.period;
            newRequest.status = 'pending';
            const result = await newRequest.save();
            return newRequest;
        })
    )
    .patch('/:clubCode', async ({ params: { clubCode }, body }) => {
        // handle update request
    })
    .get('/:clubCode', async ({ params: { clubCode }, set }) => {
        return clubCode;
    })
    .delete('/:clubCode', async ({ params: { clubCode }}) => {})

//==================================================
// Server Setup
//==================================================

export const app = new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString());
    })
    .use(clubs)
    .use(requests)
    .listen(3000, () => {
        console.log('Server is listening on port 3000');
    })
