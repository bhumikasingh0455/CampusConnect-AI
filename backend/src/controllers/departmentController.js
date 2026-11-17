const Department = require('../models/Department');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('headOfDepartment', 'name email phone')
      .sort({ name: 1 });
    return successResponse(res, { departments });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('headOfDepartment', 'name email phone');
    if (!department) {
      return errorResponse(res, 'Department not found', 404);
    }
    return successResponse(res, { department });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, code, description, headOfDepartment, building, establishedYear } = req.body;
    const existing = await Department.findOne({
      $or: [{ code: code.toUpperCase() }, { name }]
    });

    if (existing) {
      return errorResponse(res, 'Department with this name or code already exists', 400);
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
      headOfDepartment: headOfDepartment || null,
      building,
      establishedYear
    });

    return successResponse(res, { department }, 'Department created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, code, description, headOfDepartment, building, establishedYear } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return errorResponse(res, 'Department not found', 404);
    }

    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    if (description !== undefined) department.description = description;
    if (headOfDepartment !== undefined) department.headOfDepartment = headOfDepartment || null;
    if (building) department.building = building;
    if (establishedYear) department.establishedYear = establishedYear;

    await department.save();
    return successResponse(res, { department }, 'Department updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return errorResponse(res, 'Department not found', 404);
    }
    return successResponse(res, {}, 'Department deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
