update t_post h,(	
		select 	
				hr.unique_id,	
				hr.E0122_0,	
				hr.fullname as hrfull,	
				hr.fullpath as hrpath,	
				org.fullname as orgfull,	
				org.fullpath as orgpath	
			from t_post hr	
			left join t_org org on org.b0110_0 = hr.E0122_0	
			where 1=1	
			and ( (hr.fullname is null and org.fullname is not null) or (hr.fullname <> org.fullname or hr.fullpath <> org.fullpath) )	
		)as temp	
		set h.fullname = temp.orgfull , h.fullpath = temp.orgpath	
		where h.unique_id = temp.unique_id 