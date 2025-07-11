const admin = require("firebase-admin");
const serviceAccount = require("C:\\Users\\HP\\Downloads\\nxthyre-firebase-adminsdk-fbsvc-97a33711b7.json"); // <-- Your key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function deleteAllUsers(nextPageToken) {
  try {
    const result = await admin.auth().listUsers(1000, nextPageToken);

    const uids = result.users.map((user) => user.uid);
    if (uids.length > 0) {
      const deleteResult = await admin.auth().deleteUsers(uids);
      console.log(`✅ Deleted ${deleteResult.successCount} users.`);
      if (deleteResult.failureCount > 0) {
        console.log(`❌ Failed to delete ${deleteResult.failureCount} users.`);
        deleteResult.errors.forEach((err) => {
          console.error(`Error deleting user at index ${err.index}:`, err.error);
        });
      }
    }

    if (result.pageToken) {
      await deleteAllUsers(result.pageToken);
    } else {
      console.log("🎉 All users deleted.");
    }
  } catch (error) {
    console.error("🚨 Error while deleting users:", error);
  }
}

deleteAllUsers();
