import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryService from "../../services/categoryService";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await categoryService.createCategory(newCategory);
            setNewCategory({ name: "", description: "" }); // Reset form
            loadCategories(); // Refresh list
        } catch (error) {
            alert("Failed to create category.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await categoryService.deleteCategory(id);
            loadCategories(); // Refresh list
        } catch (error) {
            alert("Failed to delete category. It might have products linked to it.");
        }
    };

    if (loading) return <div className="cart-page"><h2>Loading categories...</h2></div>;

    return (
        <div className="cart-page">
            <Link to="/admin" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
                ← Back to Dashboard
            </Link>

            <h1 style={{ marginTop: '15px' }}>Manage Categories 📁</h1>

            <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
                {/* Left: Create Form */}
                <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                    <h2>Add New Category</h2>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            required
                            type="text"
                            placeholder="Category Name (e.g. Books)"
                            className="admin-input"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        />
                        <textarea
                            required
                            placeholder="Description"
                            className="admin-input"
                            style={{ minHeight: '80px' }}
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        />
                        <button type="submit" className="admin-btn admin-btn-primary">Add Category</button>
                    </form>
                </div>

                {/* Right: Categories List */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '12px' }}>ID</th>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Description</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '12px' }}>{cat.id}</td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{cat.name}</td>
                                <td style={{ padding: '12px', color: '#6b7280' }}>{cat.description}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminCategories;