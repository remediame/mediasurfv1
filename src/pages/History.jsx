import { Table } from "react-bootstrap";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const History = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const userId = sessionStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId === "" || userId === null) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("MediaSurfv1")
        .select("query, created_at")
        .eq("user_id", userId);
      if (data) {
        const formattedSearches = data.map((s) => {
          const date = new Date(s.created_at);
          console.log(date);
          return {
            query: s.query,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
          };
        });
        setRecentSearches(formattedSearches);
      }
    };
    fetchRecentSearches();
  }, []);
  return (
    <section className="container-fluid px-3">
      <Navbar />

      <div className="container">
        <div className="d-flex my-2" style={{ cursor: "pointer" }}>
          <i
            className="bi bi-chevron-left fs-4 me-4"
            onClick={() => navigate("/")}
          ></i>
          <h3>Search History</h3>
        </div>
        <Table striped bordered rounded variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Search Query</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentSearches.map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{s.query}</td>
                <td>{s.date}</td>
                <td>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
};

export default History;
