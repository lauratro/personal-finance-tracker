import { http } from "@/api/http";  
import { DashboardUser, DashboardWidgetItem, CreateDashboardWidgetItem, DashboardWidgetBase } from "./dashboard-types";

export function createDashboard(){
    return http<DashboardUser>("/dashboard",{
     method: "POST"
    })
}

export function getDashboard(){
    return http<DashboardUser>("/dashboard",{
     method: "GET"
    })
}

export function createDashboardWidget(payload: CreateDashboardWidgetItem){
    return http<DashboardWidgetItem>("/widget", {
        method: "POST",
        body: payload
    })
}

export function getDashboardWidgets(){
    return http<DashboardWidgetItem[]>("/widget", {
        method: "GET",
    })
}

export function editDashboardWidget(widgetId: string, payload: DashboardWidgetBase){
    return http<DashboardWidgetItem>(`/widget/${widgetId}`, {
        method: "PATCH",
        body: payload
    })
}

export function deleteDashboardWidget(widgetId: string) {
    return http<DashboardWidgetItem>(`/widget/${widgetId}`, {
        method: "DELETE"
    })
}

