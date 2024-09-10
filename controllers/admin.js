const supabase = require("../config/supabaseConfig");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase
        .auth
        .signInWithPassword({
          email,
          password
        });
  
      if (error) {
        console.log("Error logging in: ", error);
        return res.status(401).send("Invalid login credentials.");
      }
  
      req.session.userId = "admin";
      req.session.authenticated = true;
  
      res.redirect("/admin/updatePage");
    } catch(err) {
      console.error("Error logging in: ", err);
      return res.status(500).json({ error: err });
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error("Session not destroyed", err);
        return res.status(500).send("Error logging out, please try again.");
      }
  
      res.redirect("/");
    });
  },

  getUpdatePage: (req, res) => {
    if (req.session.authenticated) {
      res.render("update", { record: null, message: null });
    } else {
      res.render("login");
    }
  },

  getUpdateRecord: async (req, res) => {
    const memorialID = req.query.memorialID;

    let query = supabase
      .from("cemetery_register")
      .select(`
        id,
        name_last,
        name_maiden,
        name_first,
        name_middle,
        title,
        birth_date,
        death_date,
        age,
        is_veteran,
        section,
        lot,
        moved_from,
        moved_to_lot,
        notes
      `)
      .eq("id", memorialID);
  
    try {
      const { data, error } = await query;
  
      if (error) {
        throw error;
      }
  
      let dataObject = data[0];
      if (dataObject) {
        res.render("update", { record: dataObject });
      } else {
        res.render("update", { record: null, message: "No matching record found. Please check the value and try again." });
      }
    } catch(err) {
      console.error("Error fetching data: ", err);
    }
  },

  updateRecord: async (req, res) => {
    if (req.session.authenticated) {
      try {
        const updatedData = await updateRecordInSupabase(req.body);
        res.render("update", { record: null, message: "Record updated successfully." });
      } catch(err) {
        console.error("Error updating the database: ", err);
        res.render("update", { record: null, message: "Error updating record. Please try again." });
      }
    } else {
      res.render("login");
    }
  }
}

// Helper Function
async function updateRecordInSupabase(formData) {
  try {
    const recordID = formData.id;
    console.log(formData);
    // delete formData.id;    // Delete unique ID to prevent updating it.
    const { data, error } = await supabase
      .from("cemetery_register")
      .update(formData)
      .eq("id", recordID);

    if (error) {
      throw error;
    }

  } catch(err) {
    console.error("Error updating database: ", err);
    throw err;    // Rethrow error to be handled by the calling function.
  }
}