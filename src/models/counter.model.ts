import { model, Schema } from 'mongoose'

export interface ICounter {
	_id: string
	seq: number
}

const counterSchema = new Schema<ICounter>({
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 },
})

const Counter = model<ICounter>('Counter', counterSchema)

export const getNextSequence = async (name: string): Promise<number> => {
	const counter = await Counter.findByIdAndUpdate(
		name,
		{ $inc: { seq: 1 } },
		{ new: true, upsert: true },
	)
	return counter.seq
}

export default Counter
