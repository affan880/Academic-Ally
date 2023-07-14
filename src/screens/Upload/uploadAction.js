import { firestoreDB, getCurrentUser } from "../../Modules/auth/firebase/firebase";

class UploadAction {
    static async addToUserUploads(notesData) {
        await firestoreDB()
            .collection("Users")
            .doc(getCurrentUser().uid)
            .collection("UserUploads")
            .doc().set({ ...notesData });
    }

    static async uploadPDFToFirestore(userFirestoreData, pdf) {
        const { branch, sem, subject, category } = pdf;
        const { university, course } = userFirestoreData;
        const user = getCurrentUser();
        const {
            displayName: uploaderName,
            email: uploaderEmail,
            uid: uploaderId,
        } = user;

        const data = {
            name: pdf?.name,
            uploaderName,
            uploaderEmail,
            uploaderId: uploaderId,
            subject: subject,
            category: category,
            path: pdf.path,
            units: pdf.units,
            pfp: user.photoURL,
            date: new Date(),
            storageId: pdf.storageId,
            university,
            course,
            branch,
            sem,
        };

        const path = `NewUploads/${university}/${course}/${branch}/uploads`;
        const path2 = `NewUploads/${university}/${course}/${branch}`;

        const DocRef = firestoreDB().collection(path).doc();

        await DocRef.set(data, { merge: true }).then(async () => {
            await this.addToUserUploads(data);
        }).then(() => {
            firestoreDB().doc(path2).set({
                lastUpdated: new Date(),
            })
        });

    }
}

export default UploadAction;