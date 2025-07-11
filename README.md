

## ⚠️ IMPORTANTE

Actualmente este proyecto no se encuentra desplegado, por lo que no se puede acceder desde la web.  
Si se desea descargar e iniciarlo localmente, serán necesarias las variables de entorno para:

- Autenticación
- Correo
- API de Google Maps
- Base de datos

> Anteriormente, la base de datos estaba alojada en un servidor, pero ya no se encuentra disponible.  
> Además, se debe realizar el despliegue en Vercel para su funcionamiento completo.

Este proyecto **no se encuentra 100% terminado** por falta de tiempo.  
Presenta algunos errores al pulsar repetidamente los botones, lo cual puede impedir que la aplicación cargue correctamente.  
También hay funcionalidades pendientes o mejorables, como la recuperación de contraseña de los usuarios.
Esto se debe también al uso de tecnologías nuevas. Previamente solo disponía de experiencia con nodejs, por lo que tuve que aprender el resto en tiempo record...!

---

## 🚀 Introducción del Proyecto

Este proyecto consiste en el desarrollo de una plataforma web de gestión de reservas orientada a **múltiples negocios**, implementada con **React** y **Next.js**.  
La aplicación permite que distintos establecimientos —como peluquerías, clínicas, gimnasios o centros de estética— gestionen sus citas y horarios de manera **independiente** dentro de un entorno compartido.

Cada negocio tendrá su propio espacio para administrar sus servicios, horarios y clientes, optimizando así la organización interna y la experiencia del usuario final.

---

## 🎯 Objetivos

### Objetivo General

Desarrollar una plataforma web multinegocio para la gestión de reservas, facilitando la administración de horarios y servicios entre negocios y clientes.

### Objetivos Específicos

- Permitir a los negocios registrar y gestionar su perfil, horarios y servicios.  
- Facilitar a los clientes la búsqueda de negocios y la reserva de servicios.  
- Implementar un sistema de notificaciones automáticas para confirmar y recordar citas.  
- Ofrecer un panel de control para que cada negocio gestione sus reservas y visualice su agenda.

---

## ⚙️ Opciones y Funcionalidades de la Aplicación

### Opciones para Clientes

- Registro e inicio de sesión.  
- Búsqueda de negocios registrados.  
- Solicitud de cita con selección de negocio, servicio y horario disponible.  
- Cancelación o modificación de citas.  
- Visualización del historial de reservas.  
- Notificaciones de citas.  
- Perfil de usuario con datos personales.

### Opciones para Negocios

- Registro e inicio de sesión.  
- Creación y gestión de perfil del negocio (nombre, dirección, horarios, logo, etc.).  
- Configuración de servicios con su respectiva duración y precio.  
- Gestión de la disponibilidad horaria.  
- Visualización de las reservas y posibilidad de confirmar o rechazar.  
- Gestión de citas: creación, modificación y cancelación.  
- Notificaciones automáticas a clientes sobre cambios o cancelaciones.

---

## 🧰 Tecnologías a Utilizar

### Frontend

- **React con Next.js** → Para la creación de la interfaz y el manejo de páginas dinámicas.  
- **Tailwind CSS** → Para el diseño de una interfaz moderna y adaptable.

### Backend

- **Next.js (API Routes)** → Para la lógica del servidor y la gestión de reservas.  
- **Node.js** → Para el entorno de ejecución del backend.  
- **NextAuth.js** → Para la autenticación de usuarios.

### Base de Datos

- **PostgreSQL** → Para la gestión relacional de los datos.  
- **Prisma ORM** → Para facilitar las consultas y manipulación de la base de datos.

### Notificaciones

- **Nodemailer** → Para el envío automático de correos electrónicos (confirmaciones, recordatorios, etc.).

### Despliegue

- **Vercel** → Para el despliegue de la aplicación, aprovechando su integración nativa con Next.js.

---

**Desarrollado por:**  
**David Tortosa Sánchez**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


