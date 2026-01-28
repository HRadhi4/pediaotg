"""
Growth Charts Routes - Proxy PDF files for Growth Chart feature
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
import httpx

router = APIRouter(prefix="/growth-charts", tags=["growth-charts"])

# CDC PDF URLs mapping
CDC_PDFS = {
    "stature-weight-boys": "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/5hpnooem_Stature%20for%20afe%20and%20weight%20for%20age%20Boys%20percentiles.pdf",
    "stature-weight-girls": "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/f49s7ypi_Stature%20for%20afe%20and%20weight%20for%20age%20Girls%20percentiles.pdf",
    "bmi-boys": "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/zgvqqqk9_BMI%20for%20age%20Boys%20percentiles.pdf",
    "bmi-girls": "https://customer-assets.emergentagent.com/job_pediatric-tools-2/artifacts/bwb6u7fn_BMI%20for%20age%20Girls%20percentiles.pdf"
}


@router.get("/pdf/{chart_type}/{gender}")
async def get_growth_chart_pdf(chart_type: str, gender: str):
    """
    Proxy endpoint to fetch CDC growth chart PDFs.
    
    Args:
        chart_type: "stature-weight" or "bmi"
        gender: "boys" or "girls"
    
    Returns:
        The PDF file content
    """
    key = f"{chart_type}-{gender}"
    
    if key not in CDC_PDFS:
        raise HTTPException(
            status_code=404, 
            detail=f"Chart not found. Valid options: {list(CDC_PDFS.keys())}"
        )
    
    pdf_url = CDC_PDFS[key]
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(pdf_url, timeout=30.0)
            response.raise_for_status()
            
            return Response(
                content=response.content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f'inline; filename="cdc-{key}.pdf"',
                    "Access-Control-Allow-Origin": "*"
                }
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch PDF: {str(e)}")
