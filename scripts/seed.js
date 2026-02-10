const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicine-encyclopedia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas (matching TypeScript models)
const CompoundSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  chemical_class: { type: String, required: true },
  mechanism_of_action: { type: String, required: true },
  common_uses: [String],
  common_side_effects: [String],
  warnings: String,
  related_medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  compound: { type: mongoose.Schema.Types.ObjectId, ref: 'Compound', required: true },
  brand_names: [String],
  general_usage_info: { type: String, required: true },
  general_dosage_info: String,
  interactions: String,
  safety_info: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const Compound = mongoose.models.Compound || mongoose.model('Compound', CompoundSchema);
const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Compound.deleteMany({});
    await Medicine.deleteMany({});
    await AdminUser.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const admin = await AdminUser.create({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
    });
    console.log(`✅ Created admin user: ${admin.email}`);

    // Create compounds
    const acetaminophen = await Compound.create({
      name: 'Acetaminophen',
      description: 'Acetaminophen, also known as paracetamol, is a widely used over-the-counter pain reliever and fever reducer. It is one of the most commonly used medications for mild to moderate pain and fever.',
      chemical_class: 'Analgesic and Antipyretic',
      mechanism_of_action: 'Acetaminophen works by inhibiting prostaglandin synthesis in the central nervous system, which reduces pain perception and lowers fever. Unlike NSAIDs, it has minimal anti-inflammatory effects.',
      common_uses: [
        'Relief of mild to moderate pain (headache, muscle aches, toothache)',
        'Reduction of fever',
        'Pain management in arthritis',
        'Post-surgical pain relief'
      ],
      common_side_effects: [
        'Nausea',
        'Stomach pain',
        'Loss of appetite',
        'Rash (rare)',
        'Liver damage (with overdose)'
      ],
      warnings: 'Do not exceed the recommended dose. Overdose can cause severe liver damage. Avoid alcohol while taking this medication. Consult a healthcare provider if symptoms persist beyond 10 days.',
      slug: 'acetaminophen',
    });

    const ibuprofen = await Compound.create({
      name: 'Ibuprofen',
      description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) commonly used to reduce pain, fever, and inflammation. It is available over-the-counter and by prescription in higher doses.',
      chemical_class: 'NSAID (Nonsteroidal Anti-Inflammatory Drug)',
      mechanism_of_action: 'Ibuprofen works by inhibiting cyclooxygenase (COX) enzymes, which are responsible for prostaglandin synthesis. This reduces inflammation, pain, and fever.',
      common_uses: [
        'Pain relief (headache, dental pain, menstrual cramps)',
        'Reduction of inflammation',
        'Fever reduction',
        'Management of arthritis symptoms'
      ],
      common_side_effects: [
        'Stomach upset or pain',
        'Heartburn',
        'Nausea',
        'Dizziness',
        'Increased risk of bleeding'
      ],
      warnings: 'May increase risk of heart attack or stroke, especially with long-term use. Can cause stomach bleeding. Not recommended for people with kidney disease or during pregnancy (third trimester). Consult healthcare provider before use.',
      slug: 'ibuprofen',
    });

    console.log('✅ Created 2 compounds');

    // Create medicines
    const tylenol = await Medicine.create({
      name: 'Tylenol',
      description: 'Tylenol is a popular brand name for acetaminophen, used to relieve pain and reduce fever. It is one of the most trusted over-the-counter medications for various types of pain.',
      compound: acetaminophen._id,
      brand_names: ['Tylenol', 'Panadol', 'Calpol', 'FeverAll'],
      general_usage_info: 'Tylenol is commonly used for treating headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers. It can be taken with or without food.',
      general_dosage_info: 'Adults: 325-650 mg every 4-6 hours or 1000 mg every 6-8 hours. Do not exceed 4000 mg per day. Children: Dosage based on weight. Always consult a healthcare professional for personalized dosing recommendations.',
      interactions: 'Avoid alcohol while taking Tylenol as it increases the risk of liver damage. Be cautious when taking other medications that contain acetaminophen to avoid overdose.',
      safety_info: 'Keep out of reach of children. Do not use if you have liver disease without consulting a doctor. Seek immediate medical attention if overdose is suspected. Store at room temperature.',
      slug: 'tylenol',
    });

    const advil = await Medicine.create({
      name: 'Advil',
      description: 'Advil is a widely recognized brand of ibuprofen, used for pain relief, fever reduction, and reducing inflammation. It is effective for various types of pain and discomfort.',
      compound: ibuprofen._id,
      brand_names: ['Advil', 'Motrin', 'Nurofen', 'Brufen'],
      general_usage_info: 'Advil is used to treat pain from headaches, menstrual cramps, muscle aches, arthritis, and minor injuries. It also reduces fever and inflammation.',
      general_dosage_info: 'Adults: 200-400 mg every 4-6 hours as needed. Do not exceed 1200 mg per day without medical supervision. Children: Dosage based on age and weight. Always consult a healthcare professional for appropriate dosing.',
      interactions: 'May interact with blood thinners, aspirin, and other NSAIDs. Can increase blood pressure when taken with certain medications. Consult your doctor if taking other medications.',
      safety_info: 'Take with food or milk to reduce stomach upset. Not recommended for people with a history of stomach ulcers or bleeding disorders. Avoid during the last trimester of pregnancy. Seek medical attention if you experience severe stomach pain or signs of allergic reaction.',
      slug: 'advil',
    });

    console.log('✅ Created 2 medicines');

    // Update compound references
    acetaminophen.related_medicines = [tylenol._id];
    await acetaminophen.save();

    ibuprofen.related_medicines = [advil._id];
    await ibuprofen.save();

    console.log('✅ Updated compound-medicine relationships');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Admin users: 1`);
    console.log(`   - Compounds: 2`);
    console.log(`   - Medicines: 2`);
    console.log(`\n🔐 Admin credentials:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
};

// Run the seed function
seedData();
