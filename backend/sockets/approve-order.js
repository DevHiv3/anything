

export default async function ApproveOrder(socket, io, deliveryPerson, deliveryNumber, orderId, otp, deliverySockets, users){
    console.log(`Name: ${deliveryPerson}, number: ${deliveryNumber}, otp: ${otp}`)

    let clientSocketId = null;
    for (const [clientId, clientData] of Object.entries(users)) {
        if (clientData.orderId === orderId) {
            clientSocketId = clientId;
            break;  // Stop once found
        }
    }

    if (clientSocketId) {
        console.log(`Emitting OTP to client: ${clientSocketId}`);
        io.to(clientSocketId).emit("display-otp", deliveryPerson, deliveryNumber, otp);
    } else {
        console.log(`No client found for Order ID: ${orderId}`);
    }
    //socket.broadcast.emit("display-otp", deliveryPerson, deliveryNumber, otp)
}