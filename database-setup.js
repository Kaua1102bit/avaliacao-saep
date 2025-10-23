const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
async function setupDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define schemas
    const UserSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, enum: ['admin', 'user'], default: 'user' },
    }, { timestamps: true });

    const ProductSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      size: { type: String, required: true },
      weight: { type: Number, required: true },
      material: { type: String, required: true },
      currentStock: { type: Number, default: 0 },
      minStock: { type: Number, required: true },
      price: { type: Number, required: true },
    }, { timestamps: true });

    const StockMovementSchema = new mongoose.Schema({
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      type: { type: String, enum: ['entrada', 'saida'], required: true },
      quantity: { type: Number, required: true },
      date: { type: Date, required: true },
      responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      notes: { type: String },
    }, { timestamps: true });

    // Create models
    const User = mongoose.model('User', UserSchema);
    const Product = mongoose.model('Product', ProductSchema);
    const StockMovement = mongoose.model('StockMovement', StockMovementSchema);

    // Create default admin user
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
      });
      await admin.save();
      console.log('Admin user created: username=admin, password=admin123');
    }

    // Sample products
    const sampleProducts = [
      {
        name: 'Parafusadeira Elétrica Sem Fio',
        description: 'Parafusadeira 18V com bateria de longa duração e torque ajustável',
        category: 'Ferramentas Elétricas',
        size: 'Compacta',
        weight: 1.2,
        material: 'Plástico reforçado e aço',
        currentStock: 60,
        minStock: 10,
        price: 299.90,
      },
      {
        name: 'Conjunto de Brocas Aço Rápido (10 peças)',
        description: 'Kit de brocas HSS para metal e madeira, estojo resistente',
        category: 'Acessórios de Corte',
        size: 'Conjunto',
        weight: 0.25,
        material: 'Aço rápido (HSS)',
        currentStock: 150,
        minStock: 30,
        price: 39.50,
      },
      {
        name: 'Kit Chaves Allen Torx (15 peças)',
        description: 'Jogo de chaves hexagonais e torx em estojo magnético',
        category: 'Ferramentas Manuais',
        size: '15 peças',
        weight: 0.4,
        material: 'Aço cromado',
        currentStock: 120,
        minStock: 20,
        price: 49.90,
      },
      {
        name: 'Lâmina Serra Tico-Tico 5 unidades',
        description: 'Lâminas para serra tico-tico, variados dentes para madeira e metal',
        category: 'Acessórios de Corte',
        size: 'Pack 5',
        weight: 0.12,
        material: 'Aço temperado',
        currentStock: 200,
        minStock: 40,
        price: 29.90,
      },
      {
        name: 'Luva de Proteção Anticorte Nível 3',
        description: 'Luva resistente a cortes, ideal para manuseio de chapas e ferramentas',
        category: 'Equipamento de Proteção',
        size: 'M',
        weight: 0.08,
        material: 'Fibra HPPE com revestimento nitrílico',
        currentStock: 250,
        minStock: 50,
        price: 19.90,
      },
      {
        name: 'Óculos de Proteção Antiembaçante',
        description: 'Óculos de segurança com lente antiembaçante e proteção lateral',
        category: 'Equipamento de Proteção',
        size: 'Único',
        weight: 0.06,
        material: 'Policarbonato',
        currentStock: 180,
        minStock: 30,
        price: 24.50,
      },
    ];

    for (const productData of sampleProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        console.log(`Product created: ${productData.name}`);
      }
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

setupDatabase();
