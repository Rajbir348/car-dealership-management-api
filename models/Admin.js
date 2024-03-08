

const adminCollection = 'admins';

const AdminModel = {
  async findOneByEmail(email, db) {
    return await db.collection(adminCollection).findOne({ admin_id: email });
  },
};

export default AdminModel;
