import pool from "../database/keys.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authenticationController = {};

//iniciar sesion
authenticationController.signIn = async (req, res) => {
  const { email, role_id, password } = req.body.data;

  const query =
    "SELECT * FROM users WHERE email = $1 AND role_id = $2 AND current_status = 'active'";
  const values = [email, role_id];
  const { rows } = await pool.query(query, values);

  try {
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid Credentials" });
      } else {
        if (role_id == 1) {
          res.status(200).json({
            message: "ADMIN signin successfully",
            admin: user
          });
        } else if (role_id == 2) {
          res.status(200).json({
            message: "AGENT signin successfully",
            agent: user
          });
        } else {
          res.status(200).json({
            message: "CLIENT signin successfully",
            client: user
          });
        }
      }
    } else {
      return res.status(400).json({
        message:
          "Your credentials are invalid or your account has been disabled"
      });
    }
  } catch (error) {
    if (error.message === "Illegal arguments: string, undefined") {
      res.status(500).json({
        message: "Faild to signin",
        error: error.message
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

//registrar administradores
authenticationController.signAdmin = async (req, res) => {
  const {
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
    password
  } = req.body.data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // //crear administradores
  if (role_id == 1) {
    const query_admin =
      "SELECT * FROM users WHERE id = $1 AND role_id = 1 AND current_status = 'active'";
    const values_admin = [agent_id];
    try {
      const { rows } = await pool.query(query_admin, values_admin);
      if (rows.length > 0) {
        const admin = rows[0];
        if (admin.role_id === 1) {
          const query =
            "INSERT INTO users (first_name, last_name, bussiness_name, tax_id_number, phone_number, adress, email, current_status, created_at, update_at, agent_id, role_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)";
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
            hashedPassword
          ];
          const new_admin = {
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
            hashedPassword
          };
          try {
            await pool.query(query, values);
            res.status(200).json({
              message: "ADMIN registered successfully",
              admin: new_admin
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
        } else {
          res.status(500).json({
            message: "Your role is not ADMIN"
          });
        }
      } else {
        res.status(500).json({
          message: "The administrator not found or disabled"
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "The administrator not found or disabled",
        error: error.message
      });
    }
  } else {
    res.status(500).json({
      message: "Undefined role or the administrator is disabled"
    });
  }
};

//registrar agentes
authenticationController.signAgent = async (req, res) => {
  const {
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
    password
  } = req.body.data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //crear agentes
  if (role_id == 2) {
    const query_agent =
      "SELECT * FROM users WHERE id = $1 AND current_status = 'active' AND ( role_id = 1 OR role_id = 2 )";
    const values_agent = [agent_id];
    try {
      const { rows } = await pool.query(query_agent, values_agent);

      if (rows.length > 0) {
        const agent = rows[0];

        if (agent.role_id == 1 || agent.role_id == 2) {
          const query =
            "INSERT INTO users (first_name, last_name, bussiness_name, tax_id_number, phone_number, adress, email, current_status, created_at, update_at, agent_id, role_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)";
          const values = [
            first_name,
            last_name,
            bussiness_name,
            tax_id_number,
            phone_number,
            adress,
            email,
            "active",
            created_at,
            update_at,
            agent_id,
            role_id,
            hashedPassword
          ];
          const new_agent = {
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
            hashedPassword
          };

          try {
            await pool.query(query, values);
            res.status(200).json({
              message: "AGENT registered successfully",
              agent: new_agent
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
        } else {
          res.status(500).json({
            message: "Your role is different from agent or administrator"
          });
        }
      } else {
        res.status(500).json({
          message: "The (administrator, agent) not found or disabled"
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "The  (administrator, agent) not found or disabled",
        error: error.message
      });
    }
  } else {
    res.status(500).json({
      message: "Undefined  role or the (administrator, agent) is disabled"
    });
  }
};

//registrar clientes
authenticationController.signClient = async (req, res) => {
  const {
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
    password
  } = req.body.data;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //crear clientes
  if (role_id == 3) {
    if (agent_id) {
      const query_agent =
        "SELECT * FROM users WHERE id = $1 AND current_status = 'active' AND ( role_id = 1 OR role_id = 2 )";
      const values_agent = [agent_id];

      try {
        const { rows } = await pool.query(query_agent, values_agent);

        if (rows.length > 0) {
          const agent = rows[0];
          if (agent.role_id === 1 || agent.role_id === 2) {
            const query =
              "INSERT INTO users (first_name, last_name, bussiness_name, tax_id_number, phone_number, adress, email, current_status, created_at, update_at, agent_id, role_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)";
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
              hashedPassword
            ];

            const new_client = {
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
              hashedPassword
            };
            try {
              await pool.query(query, values);
              res.status(200).json({
                message: "CLIENT registered successfully",
                agent: new_client
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
          } else {
            res.status(500).json({
              message: "Your role is different from agent or administrator"
            });
          }
        } else {
          res.status(500).json({
            message: "The (administrator, agent) not found or disabled"
          });
        }
      } catch (error) {
        res.status(500).json({
          message: "The  (administrator, agent) not found or disabled",
          error: error.message
        });
      }
    } else {
      if (
        agent_id.length == 0 ||
        agent_id == null ||
        agent_id == undefined ||
        agent_id == "0"
      ) {
        const query =
          "INSERT INTO users (first_name, last_name, bussiness_name, tax_id_number, phone_number, adress, email, current_status, created_at, update_at, agent_id, role_id, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)";
        const values = [
          first_name,
          last_name,
          bussiness_name,
          tax_id_number,
          phone_number,
          adress,
          email,
          "inactive",
          created_at,
          update_at,
          null,
          role_id,
          hashedPassword
        ];
        const new_client = {
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
          hashedPassword
        };

        try {
          await pool.query(query, values);
          res.status(200).json({
            message: "CLIENT registered successfully",
            agent: new_client
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
      } else {
        res.status(500).json({
          message: "Incorrect user registration"
        });
      }
    }
  } else {
    res.status(500).json({
      message: "Undefined role or the (administrator, agent) is disabled"
    });
  }
};

module.exports = authenticationController;
