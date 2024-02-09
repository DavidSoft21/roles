import pool from "../database/keys.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const clientController = {};

//consultar clientes
clientController.get = async (req, res) => {
  const auth_user = req.query;
  let query_client = "SELECT * FROM users";

  if (auth_user.role_id == 1 || auth_user.role_id == 2) {
    query_client = "SELECT * FROM users";
  } else {
    query_client = "SELECT * FROM users WHERE email = $1";
  }

  try {
    let rows;

    if (auth_user.role_id == 1 || auth_user.role_id == 2) {
      rows = await pool.query(query_client);
    } else {
      const values_client = [auth_user.id];
      rows = await pool.query(query_client, values_client);
    }

    if (rows.rows.length > 0) {
      res.status(200).json({
        message: "CLIENTS found successfully",
        clients: rows.rows
      });
    } else {
      res.status(500).json({
        message: "Client not found or disabled"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error when trying to get the user",
      error: error.message
    });
  }
};
//actualizar clientes
clientController.update = async (req, res) => {
  const auth_user = req.body.user_auth;
  const {
    id = req.params.id,
    password,
    role_id,
    agent_id,
    first_name,
    last_name,
    bussiness_name,
    tax_id_number,
    phone_number,
    adress,
    email,
    current_status,
    created_at,
    update_at
  } = req.body.data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query_client = "SELECT * FROM users WHERE id = $1";
  const values_client = [id];

  try {
    const { rows } = await pool.query(query_client, values_client);
    if (rows.length > 0) {
      //solo si eres agente o administrador podra modificar los datos de los clientes
      if (auth_user.role_id == 1 || auth_user.role_id == 2) {
        const query =
          "UPDATE users SET first_name = $1, last_name = $2, bussiness_name = $3, tax_id_number = $4, phone_number = $5, adress = $6, email = $7, current_status = $8, created_at = $9, update_at = $10, agent_id = $11, role_id = $12, password = $13 WHERE id = $14";
        const values = [
          first_name,
          last_name,
          bussiness_name,
          tax_id_number,
          phone_number,
          adress,
          email,
          current_status,
          created_at,
          update_at,
          agent_id,
          role_id,
          hashedPassword,
          id
        ];
        try {
          await pool.query(query, values);
          const { rows } = await pool.query(query_client, values_client);
          const client_updated = rows;
          res.status(200).json({
            message: "CLIENT updated successfully",
            client: client_updated
          });
        } catch (error) {
          if (error.code == 23505) {
            res.status(500).json({
              message: "Email already exists",
              error: error.message
            });
          } else {
            res.status(500).json({ message: error.message });
          }
        }
      } else if (auth_user.id == rows[0].id) {
        const update_query_client =
          "UPDATE users SET first_name = $1, last_name = $2, bussiness_name = $3, tax_id_number = $4, phone_number = $5, adress = $6, email = $7, created_at = $8, update_at = $9, password = $10 WHERE id = $11";
        const update_values_client = [
          first_name,
          last_name,
          bussiness_name,
          tax_id_number,
          phone_number,
          adress,
          email,
          created_at,
          update_at,
          hashedPassword,
          id
        ];
        try {
          await pool.query(update_query_client, update_values_client);
          const { rows } = await pool.query(query_client, values_client);
          const updated = rows;
          res.status(200).json({
            message: "CLIENT updated successfully",
            client: updated
          });
        } catch (error) {
          if (error.code == 23505) {
            res.status(500).json({
              message: "Email already exists",
              error: error.message
            });
          } else {
            res.status(500).json({ message: error.message });
          }
        }
      }
    } else {
      res.status(500).json({
        message: "Client not found or disabled"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error when trying to get the user",
      error: error.message
    });
  }
};
//borrar clientes
clientController.delete = async (req, res) => {
  const auth_user = { auth_email: req.params.auth_email };
  const id = req.params.id;

  const query_client = "SELECT * FROM users WHERE email = $1";
  const values_client = [auth_user.auth_email];

  try {
    const { rows } = await pool.query(query_client, values_client);
    const reg = await rows;
    if (reg.length > 0) {
      let role = await reg[0].role_id;
      //solo si eres agente o administrador podra eliminar clientes

      if (role == 1 || role == 2) {
        const query = "DELETE from users WHERE id = $1";
        const values = [id];
        try {
          await pool.query(query, values);
          res.status(200).json({
            message: "CLIENT deleted successfully"
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      } else {
        res.status(200).json({
          message: "You do not have permissions to perform this action"
        });
      }
    } else {
      res.status(500).json({
        message: "Client not found or disabled"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error when trying to get the user",
      error: error.message
    });
  }
};

//borrar clientes
// clientController.delete = async (req, res) => {
//   const query = "DELETE from users WHERE id = $1";
//   const values = [req.params.id];

//   try {
//     // Asegúrate de que pool esté definido
//     await pool.query(query, values);
//     res.status(200).json({
//       message: "CLIENT deleted successfully"
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = clientController;
