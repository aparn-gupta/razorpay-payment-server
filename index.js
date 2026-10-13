
import express from "express";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET


const credentials = btoa(`${keyId}:${keySecret}`);

console.log(credentials)


app.post("/order", async (req, res) => {

    const { amount, currency } = req.body

    // console.log(amount, currency)


    try {
        const response = await fetch("https://api.razorpay.com/v1/orders", {
            body: JSON.stringify({
                amount: amount,
                currency: currency,

            }),
            method: 'POST',
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        })

        const result = await response.json()

        console.log(result)

        if (result) res.status(200).json({ message: "Order created!", result })



    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "INTERNAL SERVER ERROR!", result })

    }




})



app.post('/api/payment/callback', express.urlencoded({ extended: true }), (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    console.log(razorpay_payment_id, razorpay_order_id, razorpay_signature)


    res.redirect(`https://ecommerce-dashboard-rosy-seven.vercel.app/payment-success?payment_id=${razorpay_payment_id}`);
});

const PORT = 5002

app.listen(PORT, () => {
    console.log(`App listening to PORT ${PORT} yayyy`)
})


