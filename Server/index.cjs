const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './it_erp.sqlite'
});

const Activo = sequelize.define('Activo', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    costoInicial: { type: DataTypes.FLOAT, allowNull: false },
    fechaCompra: { type: DataTypes.DATEONLY, allowNull: false },
    vidaUtilMeses: { type: DataTypes.INTEGER, defaultValue: 36 }
});

const Ticket = sequelize.define('Ticket', {
    descripcion: DataTypes.STRING,
    costoReparacion: { type: DataTypes.FLOAT, defaultValue: 0 },
    tipoFalla: DataTypes.STRING 
});

Activo.hasMany(Ticket);
Ticket.belongsTo(Activo);

app.get('/api/dashboard', async (req, res) => {
    try {
        const activos = await Activo.findAll({ include: Ticket });
        
        const reporte = activos.map(a => {
            const gastoMantenimiento = a.Tickets.reduce((sum, t) => sum + t.costoReparacion, 0);

            const porcentajeGasto = (gastoMantenimiento / a.costoInicial) * 100;
            const decision = porcentajeGasto > 50 ? 'RENOVAR' : 'MANTENER';
            
            return {
                id: a.id,
                nombre: a.nombre,
                costoOriginal: a.costoInicial,
                gastoMantenimiento: gastoMantenimiento.toFixed(2),
                porcentajeUsoMantenimiento: porcentajeGasto.toFixed(1),
                decision: decision
            };
        });
        
        res.json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/seed', async (req, res) => {
    const nuevo = await Activo.create({ 
        nombre: "Laptop Dell XPS", 
        costoInicial: 1200, 
        fechaCompra: '2023-01-01' 
    });
    await Ticket.create({ descripcion: "Cambio de pantalla", costoReparacion: 700, ActivoId: nuevo.id });
    res.send("Datos de prueba creados");
});

const PORT = 3000;
sequelize.sync().then(() => {
    console.log("¡La base de datos está lista!"); // Agrega esto para probar
    app.listen(PORT, () => {
        console.log(`🚀 Motor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Error al iniciar:", err);
});