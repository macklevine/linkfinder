LOAD DATA INFILE '~/Downloads/backlinks.csv' INTO TABLE backlinks
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(target_url, source_url, anchor_text, source_crawl_date, source_first_found_date, flag_no_follow, flag_image_link, flag_redirect, flag_frame, flag_old_crawl, flag_alt_text, flag_mention, @vsource_citation_flow, @vsource_trust_flow, @vtarget_citation_flow, @vtarget_trust_flow, source_topical_trust_flow_topic, @vsource_topical_trust_flow_value, ref_domain_topical_trust_flow_topic, @vref_domain_topical_trust_flow_value)
SET 
source_citation_flow = nullif(@vsource_citation_flow,''),
source_trust_flow = nullif(@vsource_trust_flow,''),
target_citation_flow = nullif(@vtarget_citation_flow,''),
target_trust_flow = nullif(@vtarget_trust_flow,''),
source_topical_trust_flow_value = nullif(@vsource_topical_trust_flow_value,''),
ref_domain_topical_trust_flow_value = nullif(@vref_domain_topical_trust_flow_value,'');