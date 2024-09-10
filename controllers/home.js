const supabase = require("../config/supabaseConfig");

module.exports = {
  getIndex: (req, res) => {
    res.render("index", { records: null });
  },

  getLogin: (req, res) => {
    res.render("login");
  },

  getSearch: async (req, res) => {
    const { lastName, firstName, birthYear, deathYear } = req.query;
    let query = supabase
      .from("cemetery_register")
      .select(`
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
      .order("name_last", { ascending: true });

    if (lastName) {
      query = query.ilike("name_last", `%${lastName}%`);
    }
    if (firstName) {
      query = query.ilike("name_first", `%${firstName}%`);
    }
    if (birthYear) {
      query = query.eq("birth_year", birthYear);
    }
    if (deathYear) {
      query = query.eq("death_year", deathYear);
    }

    try {
      let { data, error } = await query;
      
      if (error) {
        throw error;
      }

      console.log(data);
      res.render("index", { records: data });
    } catch(err) {
      console.error(`Error fetching data: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  }
}
