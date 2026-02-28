export async function getProfile(userId){
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select:{
            id: true,
            name: true,
            email: true,
            credits: true,
            totalCreation: true,
            emailVerified: true,
            createdAt: true
        }
    });

    if(!user){
        const error = new Error("User not found")
        error.status= 404;
        throw error;
    }

    return user;
}

export async function getcredits(userId){
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select:{
            credits: true
        }
    });
    if(!user){
        const error = new Error("User not found");
        error.status= 404;
        throw error;
    }

    return user;
}